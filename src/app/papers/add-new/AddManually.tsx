'use client'

import Button from 'src/app/components/Button'
import Input from 'src/app/components/Input'
import Select from 'src/app/components/Select'
import styled from '@emotion/styled'
import axios from 'axios'
import React, { useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'

export default function AddManually({ close }: { close: () => void }) {
  const [referenceType, setReferenceType] = useState('Journal Article')
  const [authors, setAuthors] = useState([{ fName: '', lName: '' }])
  const [journal, setJournal] = useState('')
  const [volume, setVolume] = useState('')
  const [issue, setIssue] = useState('')
  const [pages, setPages] = useState({ from: '', to: '' })
  const [year, setYear] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')

  function handleAuthorsChange(e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'fName' | 'lName') {
    const newAuthors = [...authors]
    newAuthors[index][field] = e.target.value
    setAuthors(newAuthors)
  }

  function addAuthor() {
    setAuthors([...authors, { fName: '', lName: '' }])
  }

  function removeAuthor(index: number) {
    const newAuthors = [...authors]
    newAuthors.splice(index, 1)
    setAuthors(newAuthors)
  }

  async function addNewPaper() {
    const res = await axios.post('/api/add-paper/manual', {
      referenceType,
      authors,
      journal,
      volume,
      issue,
      pages,
      year,
      month,
      day,
      title,
      abstract,
    })

    if (res.status === 200) {
      window.location.href = '/papers'
    }
  }

  return (
    <Main>
      <CloseIcon onClick={close} />
      <Select
        label="Reference Type"
        options={['Journal Article', 'Book']}
        value={referenceType}
        onChange={(e) => setReferenceType(e.target.value)}
        full
      />
      {referenceType === 'Journal Article' && (
        <>
          <Author>
            <Input
              label="Authors"
              type="text"
              name="authors"
              value={authors[0].lName}
              onChange={(e) => handleAuthorsChange(e, 0, 'lName')}
              placeholder="Last Name"
              full
            />
            <Input
              type="text"
              name="authors"
              value={authors[0].fName}
              onChange={(e) => handleAuthorsChange(e, 0, 'fName')}
              placeholder="First Name"
              full
            />
            {authors.length > 1 && <MinusIcon onClick={() => removeAuthor(0)} />}
          </Author>
          {authors.slice(1).map((author, i) => (
            <Author key={i + 1}>
              <Input
                type="text"
                name="authors"
                value={author.lName}
                onChange={(e) => handleAuthorsChange(e, i + 1, 'lName')}
                placeholder="Last Name"
                full
              />
              <Input
                type="text"
                name="authors"
                value={author.fName}
                onChange={(e) => handleAuthorsChange(e, i + 1, 'fName')}
                placeholder="First Name"
                full
              />
              <MinusIcon onClick={() => removeAuthor(i + 1)} />
            </Author>
          ))}
          <AddAuthor onClick={addAuthor}>
            <PlusIcon />
            Add Author
          </AddAuthor>
        </>
      )}
      <Input
        label="Journal"
        type="text"
        name="journal"
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        full
      />
      <Row>
        <Input
          label="Volume"
          type="text"
          name="volume"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          full
        />
        <Input label="Issue" type="text" name="issue" value={issue} onChange={(e) => setIssue(e.target.value)} full />
      </Row>
      <Row>
        <Row>
          <Input
            label="Pages"
            type="text"
            name="pages"
            value={pages.from}
            onChange={(e) => setPages({ ...pages, from: e.target.value })}
            placeholder="From"
            full
          />
          <Input
            type="text"
            name="pages"
            value={pages.to}
            onChange={(e) => setPages({ ...pages, to: e.target.value })}
            placeholder="To"
            full
          />
        </Row>
        <Input label="Year" type="text" name="year" value={year} onChange={(e) => setYear(e.target.value)} full />
      </Row>
      <Row>
        <Input label="Day" type="text" name="day" value={day} onChange={(e) => setDay(e.target.value)} full />
        <Input label="Month" type="text" name="month" value={month} onChange={(e) => setMonth(e.target.value)} full />
      </Row>
      <Input label="Title" type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} full />
      <Input
        label="Abstract"
        type="text"
        name="abstract"
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        full
      />
      <StyledButton onClick={addNewPaper}>Submit</StyledButton>
    </Main>
  )
}

const Main = styled.div`
  width: 100%;
  box-sizing: border-box;

  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  row-gap: 1rem;

  padding: 2rem 3rem;
  border-radius: 1rem;
  background-color: #282a8f;

  > svg {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
`

const Author = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;

  column-gap: 1rem;

  width: 100%;

  > svg {
    position: absolute;
    cursor: pointer;
    right: -2rem;
    bottom: 0.4rem;
  }
`

const AddAuthor = styled.button`
  justify-self: end;

  border: none;
  background-color: transparent;
  padding: 0;

  color: #e6d840;
  font-size: 1rem;
  font-family: inherit;
  font-weight: bold;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  > svg {
    margin-left: 8px;
    margin-right: 8px;
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;

  width: 100%;

  column-gap: 1rem;
`

const StyledButton = styled(Button)`
  align-self: end;
  margin-top: 1rem;
`

const PlusIcon = styled(HiPlus)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`

const MinusIcon = styled(HiMinus)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`

const CloseIcon = styled(IoClose)`
  color: #14203d;
  background-color: #e6d840;

  border-radius: 50%;
  padding: 2px;
`
