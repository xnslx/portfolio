import type {SanityImageObjectStub} from '@sanity/asset-utils'
import urlBuilder from '@sanity/image-url'
import React from 'react'

// import SanityImage from 'sanity-remix-template'
import SanityImage from '~/components/SanityImage'
import {projectDetails} from '~/sanity/projectDetails'

type RecordCoverProps = {
  title?: string | null
  image?: SanityImageObjectStub
}

export function RecordCover(props: RecordCoverProps) {
  const {title, image} = props
  console.log(props)

  return (
    <div className="relative aspect-square">
      {image ? (
        <SanityImage
          _type={'image'}
          blurDataURL={image?.blurDataURL}
          height={image.height}
          url={image.url}
          width={image.width}
          blurHash={image?.data?.blurHash}
          projectId="6htdx6s5"
          dataset="production"
          src={image.asset}
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-gray-100 text-gray-500">
          {title ?? `Missing Record art`}
        </div>
      )}
    </div>
  )
}
