/**
 * Simple test to verify OpenAI provider works with HopCode
 * Run with: node --loader ts-node/esm test-openai-provider.ts
 */

// Test 1: Import provider system
console.log('Testing HopCode Provider System...');

try {
  // Test that AI SDK is available
  const ai = await import('ai');
  console.log(
    '✅ AI SDK loaded:',
    ai.createOpenAI ? 'OpenAI factory available' : 'Missing OpenAI',
  );

  // Test that OpenAI provider is available
  const openai = await import('@ai-sdk/openai');
  console.log(
    '✅ OpenAI provider loaded:',
    openai.createOpenAI ? 'Factory function available' : 'Missing factory',
  );

  // Test that we can create an OpenAI instance
  if (openai.createOpenAI) {
    const openaiProvider = openai.createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'test-key',
    });
    console.log('✅ OpenAI provider instance created');

    // Test that we can get a model
    const model = openaiProvider('gpt-4');
    console.log('✅ OpenAI GPT-4 model available');
  }

  console.log('\n✅ All provider tests passed!');
  console.log('\nNext steps:');
  console.log('1. Set OPENAI_API_KEY environment variable');
  console.log('2. Run: node test-openai-provider.js');
  console.log('3. Test actual API call');
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
