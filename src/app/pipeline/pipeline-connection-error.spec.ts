import { PipelineConnectionError } from './pipeline-connection-error';

describe('PipelineConnectionError', () => {
  it('should create an instance', () => {
    expect(new PipelineConnectionError()).toBeTruthy();
  });
});
