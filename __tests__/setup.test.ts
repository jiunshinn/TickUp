// Test file to verify Jest setup is working correctly
describe('Jest Setup Verification', () => {
  it('should run a basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle TypeScript types', () => {
    const add = (a: number, b: number): number => a + b;
    expect(add(2, 3)).toBe(5);
  });

  it('should handle async operations', async () => {
    const asyncFunction = async (): Promise<string> => {
      return Promise.resolve('test');
    };
    const result = await asyncFunction();
    expect(result).toBe('test');
  });
});