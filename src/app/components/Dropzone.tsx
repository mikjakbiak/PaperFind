import styled from '@emotion/styled'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { DocumentProps } from 'react-pdf'
import { Document } from 'react-pdf/dist/esm/entry.webpack5'
import { DotLoader } from 'react-spinners'
import { getCompletion } from 'src/utils/openAI'

type LoadCallback = Required<DocumentProps>['onLoadSuccess']
type PDFDocumentProxy = Parameters<LoadCallback>[0]

type Props = { color?: string; infoText?: string; groupId?: string; libraryIds?: string[] }

export default function Dropzone({ color, infoText, groupId, libraryIds }: Props) {
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } = useDropzone({})
  const [errorMessage, setErrorMessage] = useState('')
  const [droppedFile, setDroppedFile] = useState<FileWithPath | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {
    //? Get the text from the first page
    const pageContext = await (await pdf.getPage(1)).getTextContent()
    //? Join the text from the first page to get the prompt
    const pageString = pageContext.items.map((item) => ('str' in item ? item.str : '')).join(' ')

    try {
      //? Get completion from OpenAI
      const completion = await getCompletion(pageString)

      if (!completion) {
        setDroppedFile(null)
        setIsLoading(false)
        setErrorMessage('Something went wrong, please try again')
        return
      }

      //? Send the prompt to the server
      const res = await axios.post('/api/add-paper/prompt', {
        completion,
        groupId,
        libraryIds,
      })

      if (res.status === 200) {
        setDroppedFile(null)
        setIsLoading(false)
        setSuccess(true)

        setTimeout(() => {
          setSuccess(false)
        }, 2000)
      }
    } catch (error: any) {
      if (error.response) {
        console.error(error.response.status)
        console.error(error.response.data)
      } else {
        console.error(error.message)
      }
      setDroppedFile(null)
      setErrorMessage('An error occurred, please try again')
      setIsLoading(false)
    }
  }

  //? Keep only the last file
  useEffect(() => {
    if (acceptedFiles.length) setIsLoading(true)
    else return

    if (acceptedFiles.length > 1) {
      acceptedFiles.shift()
    }

    if (acceptedFiles[0].type !== 'application/pdf') {
      acceptedFiles.shift()
      setErrorMessage('Only PDF files are allowed')
      setIsLoading(false)
    } else {
      setDroppedFile(acceptedFiles[0])
      setErrorMessage('')
    }
  }, [acceptedFiles])

  return (
    <>
      <Zone {...getRootProps({ className: 'dropzone' })} color={color}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {
            //? If the file is loading
            isLoading ? (
              <DotLoader color="#e6d840" size="2rem" />
            ) : //? If the file is loaded
            success ? (
              <p className="text-lg font-bold text-white">Success</p>
            ) : isDragActive ? (
              <p className="dropzone-content">Release to drop the files here</p>
            ) : (
              <>
                <p className="dropzone-content">
                  {infoText ??
                    'Drop here a paper in the PDF format or click the button below to add the paper manually'}
                </p>
                <Error>{errorMessage}</Error>
              </>
            )
          }
        </div>
      </Zone>
      <Hidden>
        <Document file={droppedFile} onLoadSuccess={onDocumentLoadSuccess} />
      </Hidden>
    </>
  )
}

const Zone = styled.div<{ color?: string }>`
  cursor: pointer;

  width: 100%;
  min-height: 20vh;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem 3rem;
  border-radius: 1rem;
  background-color: ${({ color }) => color || '#2f31a8'};
`

const Hidden = styled.div`
  display: none;
`

const Error = styled.p`
  color: red;
`
