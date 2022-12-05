import { UncaughtErrorEvent } from './uncaught-error-event';

describe('UncaughtErrorEvent', () => {
  it('should create an instance', () => {
    expect(new UncaughtErrorEvent()).toBeTruthy();
  });
});
