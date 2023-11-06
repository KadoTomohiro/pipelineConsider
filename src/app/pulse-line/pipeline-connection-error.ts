export class PipelineConnectionError extends Error {
  static {
    this.prototype.name = 'PipelineConnectionError';
  }
    constructor(options: ErrorOptions  = {}) {
        super('The pipeline is not connected to the outlet yet.', options);
    }
}
