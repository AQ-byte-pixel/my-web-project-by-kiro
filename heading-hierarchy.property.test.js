// 标题层次结构属性测试
const fs = require('fs');
const fc = require('fast-check');

/**
 * Feature: simple-webpage, Property 4: 标题层次结构
 * 验证: 需求 2.1
 * 
 * 对于任何内容区域，标题标签（h1-h6）应该按照逻辑层次正确嵌套
 */

describe('标题层次结构属性测试', () => {
    let htmlContent;

    beforeAll(() => {
        htmlContent = fs.readFileSync('index.html', 'utf8');
    });

    test('**Feature: simple-webpage, Property 4: 标题层次结构**', () => {
        // 提取所有标题标签及其级别
        const headingRegex = /<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/gi;
        const headings = [];
        let match;

        while ((match = headingRegex.exec(htmlContent)) !== null) {
            headings.push({
                level: parseInt(match[1]),
                text: match[2].trim(),
                position: match.index
            });
        }

        fc.assert(
            fc.property(
                fc.constantFrom(...headings.map((_, index) => index)),
                (headingIndex) => {
                    if (headingIndex >= headings.length) return true;

                    const currentHeading = headings[headingIndex];

                    // 验证标题级别的逻辑性
                    if (headingIndex === 0) {
                        // 第一个标题应该是h1
                        expect(currentHeading.level).toBe(1);
                    } else {
                        const previousHeading = headings[headingIndex - 1];

                        // 标题级别不应该跳跃超过1级
                        if (currentHeading.level > previousHeading.level) {
                            expect(currentHeading.level - previousHeading.level).toBeLessThanOrEqual(1);
                        }

                        // 标题应该有有意义的文本内容
                        expect(currentHeading.text.length).toBeGreaterThan(0);
                    }

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });
    test('页面应该有正确的标题层次结构', () => {
        // 验证页面包含h1标题
        const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/i;
        expect(htmlContent).toMatch(h1Regex);

        // 验证h2标题存在且在h1之后
        const h2Regex = /<h2[^>]*>([^<]+)<\/h2>/gi;
        const h2Matches = htmlContent.match(h2Regex);
        expect(h2Matches).toBeTruthy();
        expect(h2Matches.length).toBeGreaterThan(0);
    });

    test('标题应该有有意义的文本内容', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 6 }),
                (level) => {
                    const headingRegex = new RegExp(`<h${level}[^>]*>([^<]+)<\/h${level}>`, 'gi');
                    const matches = htmlContent.match(headingRegex) || [];

                    matches.forEach(match => {
                        const contentMatch = match.match(new RegExp(`<h${level}[^>]*>([^<]+)<\/h${level}>`, 'i'));
                        if (contentMatch) {
                            const text = contentMatch[1].trim();
                            expect(text.length).toBeGreaterThan(0);
                            // 标题文本不应该只是空白字符
                            expect(text).not.toMatch(/^\s*$/);
                        }
                    });

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('标题层次应该遵循逻辑顺序', () => {
        const headingRegex = /<h([1-6])[^>]*>/gi;
        const levels = [];
        let match;

        while ((match = headingRegex.exec(htmlContent)) !== null) {
            levels.push(parseInt(match[1]));
        }

        // 验证第一个标题是h1
        if (levels.length > 0) {
            expect(levels[0]).toBe(1);
        }

        // 验证标题级别不会跳跃超过1级
        for (let i = 1; i < levels.length; i++) {
            if (levels[i] > levels[i - 1]) {
                expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
            }
        }
    });
});