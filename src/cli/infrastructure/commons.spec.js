const { getKiwiConfig } = require('./commons');

describe('getKiwiConfig()', () => {
    test('should return a value for a valid config key', () => {
        expect(
            typeof getKiwiConfig('moduleFileNameCase')
        ).toBe('string');
    });

    test('should return if key is not a valid config key', () => {
        expect(getKiwiConfig('notValidKey')).toBeNull();
    });
});
