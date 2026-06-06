/**
 * Получить шаги онбординга
 * @param {Function} t - Функция перевода из react-i18next
 * @returns {Array} Массив шагов онбординга
 */
export const getOnboardingSteps = (t) => [
    { target: '#feed-page', title: t('instruction.title_1'), content: t('instruction.global_1'), route: '/' },
    { target: '#balance-container', title: t('instruction.title_2'), content: t('instruction.global_2'), route: '/studio/create' },
    { target: '#select-ai', title: t('instruction.title_3'), content: t('instruction.global_3'), route: '/studio/create' },
    { target: '#generation-history', title: t('instruction.title_4'), content: t('instruction.global_4'), route: '/settings' },
];
