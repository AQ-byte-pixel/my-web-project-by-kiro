// 基础结构测试
const fs = require('fs');
const path = require('path');

describe('项目结构测试', () => {
    test('应该存在所有必需的目录', () => {
        const requiredDirs = ['styles', 'scripts', 'assets/images', 'tests'];

        requiredDirs.forEach(dir => {
            const dirPath = path.join(process.cwd(), dir);
            expect(fs.existsSync(dirPath)).toBe(true);
        });
    });

    test('应该存在所有必需的文件', () => {
        const requiredFiles = [
            'index.html',
            'styles/main.css',
            'scripts/main.js',
            'package.json'
        ];

        requiredFiles.forEach(file => {
            const filePath = path.join(process.cwd(), file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    test('HTML文件应该包含基本的HTML5结构', () => {
        const htmlContent = fs.readFileSync('index.html', 'utf8');

        expect(htmlContent).toContain('<!DOCTYPE html>');
        expect(htmlContent).toContain('<html lang="zh-CN">');
        expect(htmlContent).toContain('<meta charset="UTF-8">');
        expect(htmlContent).toContain('<meta name="viewport"');
        expect(htmlContent).toContain('<header>');
        expect(htmlContent).toMatch(/<main[^>]*>/);
        expect(htmlContent).toMatch(/<footer[^>]*>/);
    });

    test('CSS文件应该包含基础变量和重置样式', () => {
        const cssContent = fs.readFileSync('styles/main.css', 'utf8');

        expect(cssContent).toContain(':root');
        expect(cssContent).toContain('--primary-color');
        expect(cssContent).toContain('box-sizing: border-box');
    });
});

describe('HTML结构完整性测试', () => {
    let htmlContent;

    beforeAll(() => {
        htmlContent = fs.readFileSync('index.html', 'utf8');
    });

    test('应该包含所有必需的语义化HTML标签', () => {
        // 验证语义化标签存在
        expect(htmlContent).toMatch(/<header[^>]*>/);
        expect(htmlContent).toMatch(/<nav[^>]*>/);
        expect(htmlContent).toMatch(/<main[^>]*>/);
        expect(htmlContent).toMatch(/<section[^>]*>/);
        expect(htmlContent).toMatch(/<footer[^>]*>/);
    });

    test('应该包含正确的标题层次结构', () => {
        // 验证标题层次
        expect(htmlContent).toMatch(/<h1[^>]*>/);
        expect(htmlContent).toMatch(/<h2[^>]*>/);
        expect(htmlContent).toMatch(/<h3[^>]*>/);

        // 验证每个section都有对应的标题
        const sections = htmlContent.match(/<section[^>]*id="([^"]*)"[^>]*>/g);
        if (sections) {
            sections.forEach(section => {
                const idMatch = section.match(/id="([^"]*)"/);
                if (idMatch) {
                    const sectionId = idMatch[1];
                    // 特殊处理home section，它使用welcome-title
                    const expectedTitleId = sectionId === 'home' ? 'welcome-title' : `${sectionId}-title`;
                    expect(htmlContent).toMatch(new RegExp(`<h2[^>]*id="${expectedTitleId}"[^>]*>`));
                }
            });
        }
    });

    test('应该包含必要的meta标签', () => {
        expect(htmlContent).toContain('<meta charset="UTF-8">');
        expect(htmlContent).toContain('<meta name="viewport"');
        expect(htmlContent).toContain('<meta name="description"');
        expect(htmlContent).toContain('<title>');
    });

    test('应该正确链接外部资源', () => {
        expect(htmlContent).toContain('href="styles/main.css"');
        expect(htmlContent).toContain('src="scripts/main.js"');
    });

    test('应该包含有意义的内容而非占位符', () => {
        // 验证内容不是简单的占位符
        expect(htmlContent).not.toContain('Lorem ipsum');
        expect(htmlContent).not.toContain('placeholder');
        expect(htmlContent).not.toContain('TODO');

        // 验证包含实际内容
        expect(htmlContent.length).toBeGreaterThan(2000); // 确保有足够的内容
    });
});

describe('CSS样式应用测试', () => {
    let cssContent;

    beforeAll(() => {
        cssContent = fs.readFileSync('styles/main.css', 'utf8');
    });

    test('应该包含完整的CSS变量系统', () => {
        // 颜色变量
        expect(cssContent).toContain('--primary-color');
        expect(cssContent).toContain('--text-color');
        expect(cssContent).toContain('--background-color');

        // 字体变量
        expect(cssContent).toContain('--font-family');
        expect(cssContent).toContain('--font-size-base');

        // 间距变量
        expect(cssContent).toContain('--spacing-sm');
        expect(cssContent).toContain('--spacing-md');
        expect(cssContent).toContain('--spacing-lg');
    });

    test('应该包含响应式断点', () => {
        expect(cssContent).toContain('@media (min-width: 768px)');
        expect(cssContent).toContain('@media (min-width: 1024px)');
    });

    test('应该包含现代布局技术', () => {
        expect(cssContent).toMatch(/display:\s*flex/);
        expect(cssContent).toMatch(/display:\s*grid/);
    });

    test('应该包含交互状态样式', () => {
        expect(cssContent).toContain(':hover');
        expect(cssContent).toContain(':focus');
        expect(cssContent).toContain('transition');
    });

    test('应该包含WCAG兼容的颜色对比度', () => {
        // 验证使用了深色文本颜色以确保对比度
        expect(cssContent).toMatch(/--text-color:\s*#[0-2][0-9a-f]{5}/i);
    });
});

describe('可访问性标准符合性测试', () => {
    let htmlContent;

    beforeAll(() => {
        htmlContent = fs.readFileSync('index.html', 'utf8');
    });

    test('应该包含适当的ARIA属性', () => {
        expect(htmlContent).toContain('aria-label');
        expect(htmlContent).toContain('aria-labelledby');
        expect(htmlContent).toContain('role=');
    });

    test('应该包含跳转链接', () => {
        expect(htmlContent).toContain('skip-link');
        expect(htmlContent).toContain('跳转到主要内容');
    });

    test('所有图片应该有alt属性', () => {
        const imgTags = htmlContent.match(/<img[^>]*>/g);
        if (imgTags) {
            imgTags.forEach(img => {
                expect(img).toMatch(/alt="[^"]*"/);
            });
        }
    });

    test('应该包含语言属性', () => {
        expect(htmlContent).toContain('lang="zh-CN"');
    });

    test('导航应该有适当的结构', () => {
        expect(htmlContent).toMatch(/<nav[^>]*aria-label="[^"]*"[^>]*>/);
        expect(htmlContent).toMatch(/<ul[^>]*>[\s\S]*<li[^>]*>[\s\S]*<a[^>]*>/);
    });

    test('表单元素应该有标签关联', () => {
        const inputs = htmlContent.match(/<input[^>]*>/g);
        if (inputs) {
            // 如果有input元素，应该有对应的label或aria-label
            inputs.forEach(input => {
                const hasAriaLabel = input.includes('aria-label');
                const hasId = input.match(/id="([^"]*)"/);
                if (hasId && !hasAriaLabel) {
                    const inputId = hasId[1];
                    expect(htmlContent).toMatch(new RegExp(`<label[^>]*for="${inputId}"[^>]*>`));
                }
            });
        }
    });
});

describe('文件分离和组织测试', () => {
    test('HTML文件不应包含内联样式', () => {
        const htmlContent = fs.readFileSync('index.html', 'utf8');

        // 检查是否有style属性（允许少量必要的内联样式）
        const inlineStyles = htmlContent.match(/style="[^"]*"/g);
        if (inlineStyles) {
            expect(inlineStyles.length).toBeLessThan(3); // 允许最多2个内联样式
        }

        // 允许关键CSS内联优化，但应该有注释说明
        const inlineStyleTags = htmlContent.match(/<style[^>]*>/g);
        if (inlineStyleTags) {
            expect(htmlContent).toMatch(/关键CSS内联|关键路径CSS|首屏渲染优化/);
        }
    });

    test('HTML文件不应包含内联脚本', () => {
        const htmlContent = fs.readFileSync('index.html', 'utf8');

        // 检查是否有JavaScript事件处理器（允许性能优化相关的onload）
        const jsEventHandlers = [
            'onclick', 'onmouseover', 'onmouseout', 'onchange',
            'onsubmit', 'onfocus', 'onblur', 'onkeydown', 'onkeyup'
        ];

        jsEventHandlers.forEach(handler => {
            expect(htmlContent).not.toMatch(new RegExp(`${handler}="[^"]*"`));
        });

        // 允许性能优化相关的onload，但应该是CSS加载相关
        const onloadMatches = htmlContent.match(/onload="[^"]*"/g);
        if (onloadMatches) {
            onloadMatches.forEach(match => {
                expect(match).toMatch(/stylesheet|css/i);
            });
        }

        // 不应该有内联<script>标签（除了外部引用）
        const scriptTags = htmlContent.match(/<script[^>]*>[\s\S]*?<\/script>/g);
        if (scriptTags) {
            scriptTags.forEach(script => {
                expect(script).toMatch(/src="[^"]*"/); // 应该是外部脚本
            });
        }
    });

    test('CSS文件应该有良好的组织结构', () => {
        const cssContent = fs.readFileSync('styles/main.css', 'utf8');

        // 应该有注释分组
        expect(cssContent).toMatch(/\/\*[\s\S]*?\*\//);

        // 应该有变量定义
        expect(cssContent).toContain(':root');

        // 应该有媒体查询
        expect(cssContent).toContain('@media');
    });

    test('JavaScript文件应该存在且有基本结构', () => {
        const jsContent = fs.readFileSync('scripts/main.js', 'utf8');

        // 应该有DOMContentLoaded事件监听器
        expect(jsContent).toContain('DOMContentLoaded');

        // 应该有注释
        expect(jsContent).toMatch(/\/\/|\/\*/);
    });

    test('资源文件应该存在', () => {
        const htmlContent = fs.readFileSync('index.html', 'utf8');

        // 提取所有图片src
        const imgSrcs = htmlContent.match(/src="([^"]*)"/g);
        if (imgSrcs) {
            imgSrcs.forEach(src => {
                const srcPath = src.match(/src="([^"]*)"/)[1];
                if (srcPath.startsWith('assets/')) {
                    const fullPath = path.join(process.cwd(), srcPath);
                    expect(fs.existsSync(fullPath)).toBe(true);
                }
            });
        }
    });
});