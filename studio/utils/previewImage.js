import createImageUrlBuilder from '@sanity/image-url'
import React, {useMemo} from 'react'
import {useClient} from 'sanity'

export function PreviewImage(props) {
  const {media} = props
  const client = useClient({apiVersion: '2021-03-25'})

  const imageUrlBuilder = useMemo(() => createImageUrlBuilder(client), [client])

  const imgSrc = useMemo(
    () => media?._ref && imageUrlBuilder.image(media?._ref).width(500).url(),
    [media?._ref, imageUrlBuilder],
  )

  if (!imgSrc) {
    return null
  }

  const newProps = {
    ...props,
    media: <img src={imgSrc} />,
  }

  return props.renderDefault(newProps)
}
