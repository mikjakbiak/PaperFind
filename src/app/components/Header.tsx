'use client'

import styled from '@emotion/styled'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import Button from './Button'
import StyledLink from './StyledLink'
import Link from 'next/link'
import AccountDropdown from './AccountDropdown'
import { NumBool } from 'src/types'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    router.prefetch('/login')
    router.prefetch('/register')
    router.prefetch('/home')
    router.prefetch('/groups')
    router.prefetch('/papers')
  }, [])

  const Right = useMemo(() => {
    const landingPageJSX = (
      <Buttons>
        <StyledLink href="/login">Sign In</StyledLink>
        <Button onClick={() => router.push('/register')}>Sign Up</Button>
      </Buttons>
    )

    if (!pathname) return landingPageJSX

    const loggedInJSX = (
      <Container>
        <Navigation>
          <NavigationLink href="/home" active={Number(pathname.includes('home')) as NumBool}>
            Home
          </NavigationLink>
          <NavigationLink href="/groups" active={Number(pathname.includes('groups')) as NumBool}>
            Groups
          </NavigationLink>
          <NavigationLink href="/papers" active={Number(pathname.includes('papers')) as NumBool}>
            Papers
          </NavigationLink>
        </Navigation>
        <AccountDropdown />
      </Container>
    )

    if (pathname.includes('sign')) return

    if (pathname.includes('home') || pathname.includes('groups') || pathname.includes('papers')) return loggedInJSX

    return landingPageJSX
  }, [pathname])

  return (
    <Main>
      <Head>PaperFind</Head>
      {Right}
    </Main>
  )
}

const Main = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 3%;
`

const Head = styled.h1``

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 2rem;
`

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 5rem;
`

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  column-gap: 3rem;
`

const NavigationLink = styled(Link)<{ active?: NumBool }>`
  text-decoration: none;
  color: white;
  font-size: 1.2rem;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  ${({ active }) =>
    active &&
    `
    font-weight: bold;
    text-decoration: underline;
    color: #5485FF;
  `}
`
