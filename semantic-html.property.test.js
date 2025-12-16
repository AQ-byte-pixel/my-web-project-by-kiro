// 语义化HTML标签使用属性测试
const fs = require('fs');
const fc = require('fast-check');

/**
 * Feature: simple-webpage, Property 2: 语义化HTML标签使用
 * 验证: 需求 1.4
 * 
 * 对于任何页面元素，都应该使用适当的语义化HTML标签来确保可访问性
 */

describe('语义化HTML标签使用属性测试', () => {
    let htmlContent;

    beforeAll(() => {
        htmlContent = fs.readFileSync('index.html', 'utf8');
    });

    test('**Feature: simple-webpage, Property 2: 语义化HTML标签使用**', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(
                    'header', 'nav', 'main', 'footer', 'section', 'article',
                    'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
                ),
                (semanticTag) => {
                    // 使用正则表达式检查HTML内容中是否正确使用了语义化标签
                    const tagRegex = new RegExp(`<${semanticTag}[^>]*>`, 'gi');
                    const closingTagRegex = new RegExp(`</${semanticTag}>`, 'gi');

                    const openTags = htmlContent.match(tagRegex) || [];
                    const closeTags = htmlContent.match(closingTagRegex) || [];

                    // 如果存在该语义化标签，验证其使用是否正确
                    if (openTags.length > 0) {
                        // 验证开标签和闭标签数量匹配
                        expect(openTags.length).toBe(closeTags.length);

                        // 验证标签名称正确
                        openTags.forEach(tag => {
                            expect(tag.toLowerCase()).toMatch(new RegExp(`<${semanticTag}[^>]*>`, 'i'));
                        });
                    }

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });
    test('页面应该包含必需的语义化结构元素', () => {
        // 验证页面包含基本的语义化结构
        const requiredSemanticElements = ['header', 'main', 'footer'];

        requiredSemanticElements.forEach(tagName => {
            const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
            expect(htmlContent).toMatch(regex);
        });
    });

    test('导航元素应该使用nav标签', () => {
        const navRegex = /<nav[^>]*>/i;
        expect(htmlContent).toMatch(navRegex);

        // 验证nav元素在header中
        const headerNavRegex = /<header[^>]*>[\s\S]*?<nav[^>]*>[\s\S]*?<\/header>/i;
        expect(htmlContent).toMatch(headerNavRegex);
    });

    test('标题应该使用适当的h1-h6标签', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 1, max: 6 }),
                (level) => {
                    const headingTag = `h${level}`;
                    const headingRegex = new RegExp(`<${headingTag}[^>]*>([^<]+)</${headingTag}>`, 'gi');
                    const headings = htmlContent.match(headingRegex) || [];

                    // 如果存在该级别的标题，验证其结构
                    headings.forEach(heading => {
                        expect(heading.toLowerCase()).toMatch(new RegExp(`<${headingTag}[^>]*>`, 'i'));
                        // 标题应该有文本内容（不为空）
                        const contentMatch = heading.match(new RegExp(`<${headingTag}[^>]*>([^<]+)</${headingTag}>`, 'i'));
                        if (contentMatch) {
                            expect(contentMatch[1].trim().length).toBeGreaterThan(0);
                        }
                    });

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });
});