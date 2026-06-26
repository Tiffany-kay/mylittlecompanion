import webpush from 'web-push'

const keys = webpush.generateVAPIDKeys()
console.log('')
console.log('paste these into koyeb as environment variables:')
console.log('')
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`)
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
console.log('')
console.log('keep them somewhere safe — losing them means every device must re-subscribe.')
console.log('')
