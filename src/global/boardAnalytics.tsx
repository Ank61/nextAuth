import {
    atom,
    selector,
} from 'recoil';

export const analytics = atom({
    key: 'analytics',
    default: false,
});

// const charCountState = selector({
//     key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//     get: ({ get }) => {
//         const text = get(textState);

//         return text.length;
//     },
// });