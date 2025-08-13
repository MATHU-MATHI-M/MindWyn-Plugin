import * as tf from '@tensorflow/tfjs';

export class BehavioralAnalysisML {
  private model: tf.LayersModel | null = null;
  private isModelLoaded = false;

  async initializeModel() {
    try {
      // Create a simple neural network for stress prediction
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [8], units: 16, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 8, activation: 'relu' }),
          tf.layers.dense({ units: 3, activation: 'sigmoid' }) // stress, focus, energy
        ]
      });

      // Compile the model
      this.model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError',
        metrics: ['accuracy']
      });

      this.isModelLoaded = true;
      console.log('ML Model initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML model:', error);
    }
  }

  async analyzeStressLevel(behavioralData: {
    tabSwitches: number;
    typingSpeed: number;
    mouseMovements: number;
    scrollSpeed: number;
    idleTime: number;
    activeTime: number;
    timeOfDay: number;
    appCategory: number;
  }): Promise<{ stress: number; focus: number; energy: number; confidence: number }> {
    if (!this.isModelLoaded || !this.model) {
      // Fallback to rule-based analysis
      return this.ruleBasedAnalysis(behavioralData);
    }

    try {
      const inputTensor = tf.tensor2d([[
        behavioralData.tabSwitches / 100,
        behavioralData.typingSpeed / 100,
        behavioralData.mouseMovements / 1000,
        behavioralData.scrollSpeed / 100,
        behavioralData.idleTime / 3600000, // normalize to hours
        behavioralData.activeTime / 3600000,
        behavioralData.timeOfDay / 24,
        behavioralData.appCategory / 5
      ]]);

      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const results = await prediction.data();

      inputTensor.dispose();
      prediction.dispose();

      return {
        stress: Math.min(Math.max(results[0], 0), 1),
        focus: Math.min(Math.max(results[1], 0), 1),
        energy: Math.min(Math.max(results[2], 0), 1),
        confidence: 0.8
      };
    } catch (error) {
      console.error('ML prediction failed, using fallback:', error);
      return this.ruleBasedAnalysis(behavioralData);
    }
  }

  private ruleBasedAnalysis(data: any): { stress: number; focus: number; energy: number; confidence: number } {
    // Rule-based stress analysis as fallback
    const stressFactors = [
      data.tabSwitches > 50 ? 0.3 : 0,
      data.typingSpeed > 80 ? 0.2 : 0,
      data.mouseMovements > 500 ? 0.2 : 0,
      data.activeTime > 7200000 ? 0.3 : 0 // 2 hours
    ];

    const stress = Math.min(stressFactors.reduce((a, b) => a + b, 0), 1);
    const focus = Math.max(0, 1 - (data.tabSwitches / 100));
    const energy = Math.max(0, 1 - (data.activeTime / 14400000)); // 4 hours

    return { stress, focus, energy, confidence: 0.6 };
  }

  async trainModel(trainingData: any[]) {
    if (!this.model) return;

    try {
      const xs = tf.tensor2d(trainingData.map(d => d.features));
      const ys = tf.tensor2d(trainingData.map(d => d.labels));

      await this.model.fit(xs, ys, {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0
      });

      xs.dispose();
      ys.dispose();
      
      console.log('Model training completed');
    } catch (error) {
      console.error('Model training failed:', error);
    }
  }
}

export const mlAnalyzer = new BehavioralAnalysisML();