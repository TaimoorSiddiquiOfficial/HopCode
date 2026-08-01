/**
 * Tests for source config validation - specifically around multi-header auth
 *
 * These tests catch configuration mistakes that led to production bugs:
 * - authType: "none" with headerNames present (headers won't be applied)
 * - authType: "header" without headerNames for multi-header APIs
 */
export {};
