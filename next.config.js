/** @type {import('next').NextConfig} */


const prod = process.env.NODE_ENV === 'production'

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*"
            }
        ]
    },
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development',
    },
}

const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
})


module.exports = withPWA(nextConfig)