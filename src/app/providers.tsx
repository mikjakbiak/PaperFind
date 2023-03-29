'use client'

import React from 'react'

import RootStyleRegistry from './emotion'

export function Providers({ children }: { children: React.ReactNode }) {
    return <RootStyleRegistry>{children}</RootStyleRegistry>
}
