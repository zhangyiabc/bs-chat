import React from "react"
import multiavatar from '@multiavatar/multiavatar'
import styles from './index.module.scss'

interface Props {
  name: string
}
const Avatar: React.FC<Props> = (props: Props) => {
  const { name = '默认头像' } = props
  const avatar = multiavatar(name)

  return <div className={styles.avatar}>
    <div dangerouslySetInnerHTML={{__html: avatar}}></div>
  </div>
}

export default Avatar