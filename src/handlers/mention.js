import { instances, invalidMessage, overflowMessage } from '../common/config.js'
import { addReminder } from '../common/reminder.js'

export default async ({
  mentionView: { comment, community },
  botActions: { createComment },
}) => {
  if (!instances.hasOwnProperty(getCommunityInstance(community))) {
    return
  }

  if (!instances[getCommunityInstance(community)].includes(community.name)) {
    return
  }

  const words = comment.content.replace('/[\.,\?!]/g', '').replace(/\n/g, " ").split(' ')
  let amount = 0

  console.log(words)

  for (let i = 1; i < words.length; i++) {
    const word = words[i]

    if (word === 'seconds' || word === 'second') {
      const seconds = parseInt(words[i - 1])
      if (seconds) amount += seconds
    } else if (word === 'minutes' || word === 'minute') {
      const seconds = parseInt(words[i - 1]) * 60
      if (seconds) amount += seconds
    } else if (word === 'hours' || word === 'hour') {
      const seconds = parseInt(words[i - 1]) * 60 * 60
      if (seconds) amount += seconds
    } else if (word === 'days' || word === 'day') {
      const seconds = parseInt(words[i - 1]) * 60 * 60 * 24
      if (seconds) amount += seconds
    } else if (word === 'weeks' || word === 'week') {
      const seconds = parseInt(words[i - 1]) * 60 * 60 * 24 * 7
      if (seconds) amount += seconds
    } else if (word === 'months' || word === 'month') {
      const seconds = parseInt(words[i - 1]) * 60 * 60 * 24 * 7 * 4
      if (seconds) amount += seconds
    } else if (word === 'years' || word === 'year') {
      const seconds = parseInt(words[i - 1]) * 60 * 60 * 24 * 7 * 4 * 12
      if (seconds) amount += seconds
    }
  }

  if (amount > 0) {
    // Stop larger than 10 years
    if (amount > 315360000) {
      createComment({
        content: overflowMessage,
        parent_id: comment.id,
        post_id: comment.post_id,
      })
      return
    }

    addReminder(amount, createComment, comment)
  } else {
    createComment({
      content: invalidMessage,
      parent_id: comment.id,
      post_id: comment.post_id,
    })
  }
}

function getCommunityInstance(
  community
) {
    const [, instance] =
      /.*:\/\/(.*)\/c\//.exec(community.actor_id) || []
    return instance
}