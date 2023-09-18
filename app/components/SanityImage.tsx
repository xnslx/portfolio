/* eslint-disable import/no-default-export */
/* eslint-disable react-hooks/rules-of-hooks */
import imageUrlBuilder from '@sanity/image-url'
import type {ImageUrlBuilder} from '@sanity/image-url/lib/types/builder'
import {useEffect, useRef, useState} from 'react'
import {BlurhashCanvas} from 'react-blurhash'
import {useInView} from 'react-intersection-observer'
import {useMediaQuery} from 'react-responsive'

import type {SanityAssetImage} from '~/types/image'

const BREAKPOINTS = [640, 768, 1024, 1280, 1536] // px

export const findLastNonNullValue = (
  items: string | any[],
  currentIndex: any
) => {
  const sliced = items.slice(0, currentIndex)
  return sliced.filter((val: null) => val !== null).pop()
}

const generateSrcSet = (
  urlBuilder: ImageUrlBuilder,
  breakpoints: any[],
  {quality}: {quality: SanityAssetImage}
) => {
  return breakpoints
    .map((width: any) => {
      return `${urlBuilder
        .width(width)
        .auto('format')
        .quality(quality)} ${width}w`
    })
    .join(', ')
}

// Generate srcset sizes based off breakpoints
const generateSizes = (breakpoints: number[], sizes: any[]) => {
  if (!sizes) {
    return undefined
  }

  if (typeof sizes === 'string') {
    return sizes
  }

  if (sizes.length === 1 && sizes[0] !== null) {
    return sizes[0]
  }

  return sizes
    .map((val: null, i: number) => {
      if (i === sizes.length - 1) {
        return sizes[i]
      }

      let current = val
      if (val === null) {
        current = findLastNonNullValue(sizes, i)
      }

      return `(max-width: ${breakpoints?.[i]}px) ${current}`
    })
    .join(', ')
}

/**
 * A simple image component that wraps around `@sanity/image-url`
 */
function SanityImage(props: SanityAssetImage) {
  const {
    blurDataURL,
    crop,
    dataset,
    height,
    hotspot,
    layout,
    options,
    projectId,
    quality = 80,
    sizes,
    src,
    width,
    blurHash,
    url,
    ...rest
  } = props
  console.log('props', props)

  if (!dataset) {
    throw new Error('SanityImage is missing required "dataset" property.')
  }
  if (!projectId) {
    throw new Error('SanityImage is missing required "projectId" property.')
  }
  if (!src) {
    return null
  }

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {ref, inView} = useInView({
    threshold: 0,
    // triggerOnce: true,
  })

  const observerRef = useRef(null)
  useEffect(() => {
    ref(observerRef.current)
  }, [ref, observerRef])

  const handleOnLoad = () => {
    // setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(true)
      setIsLoading(false)
    }, 1000)
  }

  // Strip out blacklisted props
  delete rest?.['decoding']
  delete rest?.['ref']
  delete rest?.['srcSet']
  delete rest?.['style']

  const urlBuilder = imageUrlBuilder({projectId, dataset}).image({
    _ref: src._ref,
    crop,
    hotspot,
  })

  // Generate srcset + sizes
  const srcSetSizes = generateSizes(BREAKPOINTS, sizes)
  console.log('srcSetSizes', srcSetSizes)
  //@ts-ignore
  const srcSet = generateSrcSet(urlBuilder, BREAKPOINTS, {quality})
  console.log('srcSet ', srcSet)

  // Determine image aspect ratio (factoring in any potential crop)
  let aspectRatio
  if (height && width) {
    const multiplierWidth = 1 - (crop?.left || 0) - (crop?.right || 0)
    const multiplierHeight = 1 - (crop?.bottom || 0) - (crop?.top || 0)
    aspectRatio = (width * multiplierWidth) / (height * multiplierHeight)
  }

  let urlDefault = urlBuilder

  // TODO: check for valid range
  if (options?.blur) {
    urlDefault = urlDefault.blur(options.blur)
  }
  urlDefault = urlDefault.url()

  if (!blurHash) {
    return null
  }

  return (
    <div ref={observerRef}>
      <img
        {...rest}
        loading="lazy"
        alt=""
        decoding="async"
        // src={blurDataURL}
        sizes={srcSetSizes}
        src={inView || isLoaded ? url : null}
        srcSet={inView || isLoaded ? srcSet : null}
        width={width}
        height={height}
        onLoad={handleOnLoad}
        style={{
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          objectFit: 'fill',
        }}
      />
      {isLoading && (
        <BlurhashCanvas
          hash={blurHash}
          className="blurHash"
          style={{
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
            objectFit: 'fill',
          }}
        />
      )}
    </div>
  )
}

export default SanityImage;
