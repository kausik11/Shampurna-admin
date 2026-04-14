import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import serviceReducer from '../features/services/serviceSlice'
import testimonialReducer from '../features/testimonials/testimonialSlice'
import userReducer from '../features/users/userSlice'
import uiReducer from '../features/ui/uiSlice'
import newsletterReducer from '../features/newsletter/newsletterSlice'
import callbackReducer from '../features/callbacks/callbackSlice'
import resultImageReducer from '../features/resultImages/resultImageSlice'
import videoTestimonialReducer from '../features/videoTestimonials/videoTestimonialSlice'
import faqReducer from '../features/faqs/faqSlice'
import { injectStore } from '../api/axios'

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    testimonials: testimonialReducer,
    users: userReducer,
    ui: uiReducer,
    newsletter: newsletterReducer,
    callbacks: callbackReducer,
    resultImages: resultImageReducer,
    videoTestimonials: videoTestimonialReducer,
    faqs: faqReducer,
  },
})

injectStore(store)

export default store
