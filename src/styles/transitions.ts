export const slideLeft= {
    in: { opacity: 1, transform: 'scaleX(1)',display:"flex" },
    out: { opacity: 0, transform: 'scaleX(0)'},
    common: { transformOrigin: 'right' },
    transitionProperty: 'transform, opacity',
};