/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/@k8pai/tailwind-inputs/**/*.js"],
    theme: {
        container: {
            padding: "2rem",
            center: true,
        },
        extend: {
            fontFamily: {
                roboto: ["Roboto", "sans-serif"],
            },
            colors: {
                "black-blue": "#003274",
                // "black-blue": "#424893",

                "medium-blue": "#025EA1",
                // "medium-blue": "#3D5AF4",

                "almost-blue": "#6CACE4",
                "stak-blue": "#007cd4",
            },
        },
    },

    plugins: [require("@tailwindcss/forms")],
};
