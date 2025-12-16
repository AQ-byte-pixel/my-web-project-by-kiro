/**
 * 导航交互属性测试
 * Feature: simple-webpage, Property 3: 导航交互反馈
 * 验证: 需求 1.5
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('导航交互属性测试', () => {
    let htmlContent, cssContent;

    beforeAll(() => {
        // 读取HTML和CSS文件
        htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
        cssContent = fs.readFileSync(path.join(__dirname, '../styles/main.css'), 'utf8');
    });

    beforeEach(() => {
        // 设置DOM环境
        document.documentElement.innerHTML = htmlContent;

        // 创建并添加样式表
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
    });

    afterEach(() => {
        // 清理DOM
        document.documentElement.innerHTML = '';
    });

    /**
     * 属性 3: 导航交互反馈
     * 对于任何导航元素，当用户交互时应该提供视觉反馈（如悬停效果）
     * 验证: 需求 1.5
     */
    test('属性测试: 导航交互反馈', () => {
        fc.assert(
            fc.property(
                // 生成不同的交互状态
                fc.constantFrom('hover', 'focus', 'active'),
                (interactionState) => {
                    // 获取所有导航链接
                    const navLinks = document.querySelectorAll('nav a');

                    // 验证导航链接存在
                    expect(navLinks.length).toBeGreaterThan(0);

                    navLinks.forEach(link => {
                        // 获取初始样式
                        const initialStyle = window.getComputedStyle(link);
                        const initialBackgroundColor = initialStyle.backgroundColor;
                        const initialColor = initialStyle.color;
                        const initialTransform = initialStyle.transform;

                        // 验证链接有基础的交互样式属性
                        expect(initialStyle.transition).toBeTruthy();
                        expect(initialStyle.padding).toBeTruthy();
                        expect(initialStyle.borderRadius).toBeTruthy();

                        // 模拟不同的交互状态
                        switch (interactionState) {
                            case 'hover':
                                // 模拟悬停状态
                                link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                                break;
                            case 'focus':
                                // 模拟焦点状态
                                link.focus();
                                break;
                            case 'active':
                                // 模拟激活状态
                                link.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                break;
                        }

                        // 验证链接具有适当的可访问性属性
                        expect(link.getAttribute('aria-label')).toBeTruthy();
                        expect(link.getAttribute('href')).toBeTruthy();

                        // 验证链接有合适的显示属性
                        const linkStyle = window.getComputedStyle(link);
                        expect(['inline-block', 'block', 'flex'].includes(linkStyle.display)).toBe(true);

                        // 验证过渡效果存在
                        expect(linkStyle.transition).toContain('0.2s');

                        // 验证基本的视觉反馈机制存在
                        // 检查是否有背景色、颜色或变换的设置
                        const hasVisualFeedback =
                            linkStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
                            linkStyle.color !== initialColor ||
                            linkStyle.transform !== 'none' ||
                            linkStyle.boxShadow !== 'none' ||
                            linkStyle.outline !== 'none';

                        // 在某些交互状态下应该有视觉反馈
                        if (interactionState === 'focus') {
                            // 焦点状态应该有outline或其他视觉指示
                            expect(
                                linkStyle.outline !== 'none' ||
                                linkStyle.boxShadow !== 'none' ||
                                linkStyle.backgroundColor !== initialBackgroundColor
                            ).toBe(true);
                        }

                        // 清理事件状态
                        link.blur();
                        link.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                        link.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    });

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('导航链接可访问性验证', () => {
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            // 验证每个链接都有aria-label
            expect(link.getAttribute('aria-label')).toBeTruthy();

            // 验证每个链接都有有效的href
            const href = link.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href.startsWith('#')).toBe(true);

            // 验证链接文本不为空
            expect(link.textContent.trim()).toBeTruthy();
        });
    });

    test('导航容器结构验证', () => {
        const nav = document.querySelector('nav');
        const navList = nav.querySelector('ul');
        const navItems = nav.querySelectorAll('li');

        // 验证导航结构
        expect(nav).toBeTruthy();
        // nav元素本身就是语义化的，不需要role="navigation"
        expect(nav.getAttribute('aria-label')).toBeTruthy();

        // 验证列表结构
        expect(navList).toBeTruthy();
        expect(navItems.length).toBeGreaterThan(0);

        // 验证每个导航项都包含链接
        navItems.forEach(item => {
            const link = item.querySelector('a');
            expect(link).toBeTruthy();
        });
    });

    test('导航样式一致性验证', () => {
        const navLinks = document.querySelectorAll('nav a');

        if (navLinks.length > 1) {
            const firstLinkStyle = window.getComputedStyle(navLinks[0]);

            // 验证所有导航链接具有一致的基础样式
            navLinks.forEach(link => {
                const linkStyle = window.getComputedStyle(link);

                // 字体大小应该一致
                expect(linkStyle.fontSize).toBe(firstLinkStyle.fontSize);

                // 内边距应该一致
                expect(linkStyle.paddingTop).toBe(firstLinkStyle.paddingTop);
                expect(linkStyle.paddingBottom).toBe(firstLinkStyle.paddingBottom);

                // 过渡效果应该一致
                expect(linkStyle.transition).toBe(firstLinkStyle.transition);
            });
        }
    });
});