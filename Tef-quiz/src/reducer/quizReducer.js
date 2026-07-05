
//=================initialState=======================//

export const initialState = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  finished: false,
  index: 0,
  answer: {},
  points: 0,
  secondsRemaining:5,
  showReview:false,
  reviewIndex:0,
  totalQuizTime:0
};


//=================reducer function ========================//

const secPerQue= 30



export function quizReducer(state, action) {
  switch (action.type) {
    case "SET_QUESTIONS":

    console.log("APi:",action.payload)
      return { ...state, questions: action.payload ,
        secondsRemaining:state.questions.length *secPerQue,
        totalQuizTime:state.questions.length *secPerQue
      };
    case "NEW_ANSWER":
      const pquestion = state.questions.at(state.index);
      console.log("Qustion",pquestion)
      console.log("Question points",pquestion?.points)
      console.log("state points",state.points)

      if(!pquestion)return state

      const previousAnswer=state.answer[state.index]

      const newAnswer=action.payload

      const wasCorrect = previousAnswer === pquestion.correctAnswer;

      const isCorrect = newAnswer=== pquestion.correctAnswer;

      let updatedPoints= state.points

      //wrong and correct

      if(!wasCorrect && isCorrect){
        updatedPoints=state.points  + pquestion.points
      }

      //correct and wrong

      else if(wasCorrect && !isCorrect){
        updatedPoints=state.points - pquestion.points
      }
      return {
        ...state,
        answer: {...state.answer,[state.index]:newAnswer

        },points:updatedPoints
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        index:
          state.index < state.questions.length - 1
            ? state.index + 1
            : state.index,
        
      };
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        index: state.index > 0 ? state.index - 1 : 0,
      
      };

      case"FINISH_QUIZ":
      return{...state, finished:true

      }

      case"GO_TO_QUESTION":
      return{...state,index:action.payload}

      case"TICK":
      const remaining=state.secondsRemaining -1
      return{...state, secondsRemaining:remaining,
        finished: remaining<=0/*state.secondsRemaining===0? true :state.finished*/
      }

      case"SHOW_REVIEW":
      return{...state, showReview:true,reviewIndex:0}

      case"GO_TO_REVIEW":
      return{...state,reviewIndex:action.payload}
    default:
      throw Error(Unknown);
  }
}
