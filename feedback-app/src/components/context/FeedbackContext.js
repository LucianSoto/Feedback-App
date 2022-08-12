import { createContext, useEffect, useState, useRef } from 'react'
// import { v4 as uuidv4 } from 'uuid'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false
  })

  const mounted = useRef(true)

  useEffect(()=> {
    if(mounted.current) {
      mounted.current = false
      fetchFeedback()
    }
    
  }, [])

  // Fetch Feedback
  const fetchFeedback = async () => {
    const res = await fetch(`https://my-json-server.typicode.com/lucianaiolos/json-server/feedback?_sort=id&desc`)
    const data = await res.json()
    
    setFeedback(data)
    setIsLoading(false)
  }

  //Delete feedback
  const deleteFeedback = async (id) => {
      if(window.confirm('are you sure you want to delete?')) {
        await fetch(`https://my-json-server.typicode.com/lucianaiolos/json-server/feedback/${id}`, 
          {method: 'DELETE'})

        setFeedback(feedback.filter((item)=> item.id !== id))
      }
    } 
  

  //Add Feedback
  const addFeedback = async (newFeedback) => {
    console.log('hi')
    const response = await fetch(`https://my-json-server.typicode.com/lucianaiolos/json-server/feedback`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newFeedback),
    })
    const data = await response.json()

    // newFeedback.id = uuidv4()
    console.log(feedback)
    setFeedback([data, ...feedback])
    console.log(feedback)
  }


  //Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true
    })
  }

  //Update feedback item
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem)
    })

    const data = await response.json()

    setFeedback(
      feedback.map((item)=> item.id === id ? {
      ...item, ...data
    } : item))
  }

  return <FeedbackContext.Provider value={{
    feedback,
    feedbackEdit,
    isLoading,
    deleteFeedback,
    addFeedback,
    editFeedback,
    updateFeedback,
  }}>
    {children}
  </FeedbackContext.Provider>
}

export default FeedbackContext