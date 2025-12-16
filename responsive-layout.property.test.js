/**
 * 响应式布局属性测试
 * Feature: simple-webpage, Property 1: 响应式布局适应性
 * 验证: 需求 1.3
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('响应式布局属性测试', () => {
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
     * 属性 1: 响应式布局适应性
     * 对于任何视口宽度，网页布局应该正确调整以适应屏幕尺寸，不出现水平滚动条或内容溢出
     * 验证: 需求 1.3
     */
    test('属性测试: 响应式布局适应性', () => {
        fc.assert(
            fc.property(
                // 生成不同的视口宽度 (320px 到 1920px)
                fc.integer({ min: 320, max: 1920 }),
                (viewportWidth) => {
                    // 设置视口宽度
                    Object.defineProperty(window, 'innerWidth', {
                        writable: true,
                        configurable: true,
                        value: viewportWidth,
                    });

                    // 模拟媒体查询匹配
                    window.matchMedia = jest.fn().mockImplementation(query => {
                        let matches = false;

                        // 解析媒体查询
                        if (query.includes('min-width: 768px')) {
                            matches = viewportWidth >= 768;
                        } else if (query.includes('min-width: 1024px')) {
                            matches = viewportWidth >= 1024;
                        } else if (query.includes('min-width: 1280px')) {
                            matches = viewportWidth >= 1280;
                        }

                        return {
                            matches,
                            media: query,
                            onchange: null,
                            addListener: jest.fn(),
                            removeListener: jest.fn(),
                            addEventListener: jest.fn(),
                            removeEventListener: jest.fn(),
                            dispatchEvent: jest.fn(),
                        };
                    });

                    // 触发resize事件
                    window.dispatchEvent(new Event('resize'));

                    // 获取容器元素
                    const containers = document.querySelectorAll('.container');
                    const body = document.body;
                    const header = document.querySelector('header');
                    const main = document.querySelector('main');
                    const footer = document.querySelector('footer');

                    // 验证基本元素存在
                    expect(containers.length).toBeGreaterThan(0);
                    expect(body).toBeTruthy();
                    expect(header).toBeTruthy();
                    expect(main).toBeTruthy();
                    expect(footer).toBeTruthy();

                    // 验证容器宽度适应性
                    containers.forEach(container => {
                        const computedStyle = window.getComputedStyle(container);

                        // 容器应该有最大宽度限制
                        expect(computedStyle.maxWidth).toBeTruthy();

                        // 容器应该有适当的内边距
                        expect(computedStyle.paddingLeft).toBeTruthy();
                        expect(computedStyle.paddingRight).toBeTruthy();

                        // 容器应该居中对齐
                        expect(computedStyle.marginLeft).toBe('auto');
                        expect(computedStyle.marginRight).toBe('auto');
                    });

                    // 验证响应式断点行为
                    if (viewportWidth >= 768) {
                        // 平板及以上：头部应该是水平布局
                        const headerContainer = header.querySelector('.container');
                        const headerStyle = window.getComputedStyle(headerContainer);
                        expect(['flex', 'block'].includes(headerStyle.display)).toBe(true);
                    }

                    if (viewportWidth >= 1024) {
                        // 桌面及以上：主内容可能使用网格布局
                        const mainContainer = main.querySelector('.container');
                        const mainStyle = window.getComputedStyle(mainContainer);
                        expect(['grid', 'flex', 'block'].includes(mainStyle.display)).toBe(true);
                    }

                    // 验证没有水平溢出的基本条件
                    // 所有主要元素都应该有合理的宽度设置
                    [header, main, footer].forEach(element => {
                        const style = window.getComputedStyle(element);
                        // 元素应该有适当的显示属性
                        expect(['block', 'flex', 'grid'].includes(style.display) ||
                            style.display === '').toBe(true);

                        // 元素不应该有明确的最小宽度超过视口
                        const minWidth = parseInt(style.minWidth) || 0;
                        expect(minWidth <= viewportWidth).toBe(true);
                    });

                    return true;
                }
            ),
            { numRuns: 100 }
        );
    });

    test('边界情况: 最小视口宽度 (320px)', () => {
        // 设置最小移动设备宽度
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 320,
        });

        const containers = document.querySelectorAll('.container');

        containers.forEach(container => {
            const computedStyle = window.getComputedStyle(container);

            // 在最小宽度下，容器仍应有适当的内边距
            expect(computedStyle.paddingLeft).toBeTruthy();
            expect(computedStyle.paddingRight).toBeTruthy();

            // 容器宽度应该是100%
            expect(computedStyle.width).toBe('100%');
        });
    });

    test('边界情况: 大屏幕宽度 (1920px)', () => {
        // 设置大屏幕宽度
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1920,
        });

        const containers = document.querySelectorAll('.container');

        containers.forEach(container => {
            const computedStyle = window.getComputedStyle(container);

            // 在大屏幕下，容器应该有最大宽度限制
            expect(computedStyle.maxWidth).toBeTruthy();
            expect(computedStyle.maxWidth).not.toBe('none');
        });
    });
});