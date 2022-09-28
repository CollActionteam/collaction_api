module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    roots: ['<rootDir>/src'],
    testRegex: ['.spec.ts$'],
    collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    setupFiles: ['<rootDir>/test/jest.env.js'],
    coverageDirectory: './coverage',
    coverageReporters: ['html', ['text', { skipFull: true }]],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@api(.*)$': '<rootDir>/src/api/$1',
        '^@common(.*)$': '<rootDir>/src/common/$1',
        '^@domain(.*)$': '<rootDir>/src/domain/$1',
        '^@infrastructure(.*)$': '<rootDir>/src/infrastructure/$1',
        '^@modules(.*)$': '<rootDir>/src/modules/$1',
    },
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};
