'use strict';
const isDebug = true;

$('.startQuiz').click(function () {
    toggleBackground(false);
    loadQuiz();
});
$('.js-questionAnswerWrapper').on('click', `.js-resetQuiz`, function (event) {
    resetQuiz();
    toggleCoverImage()
    toggleBackground(false);
    loadQuiz(); 
});
$('.js-questionAnswerWrapper').on('click', `.js-grade`, function (event) {
    let answerIndex = getAnswerKeyfromEvent(event.currentTarget);
    let bIsValid = validateEntry(answerIndex); 
    if (bIsValid) {
        dWrite('grading question');
        let answerHtml = generateGradeQuestionTemplate(getCurrentQuestion(), answerIndex);
        toggleCoverImage();
        
        $('.js-questionAnswerWrapper').html(answerHtml);
    };
})
$('.js-questionAnswerWrapper').on('click', `.js-next`, function (event) {
    advanceQuestion();
})
function advanceQuestion() {
    QUIZ.currentQuestionIndex += 1;
    toggleCoverImage();

    if (QUIZ.currentQuestionIndex > QUIZ.questions.length - 1) {
        dWrite("Exiting Quiz to Grade View");
        handleSummaryView();  
        return false;      
    }

    dWrite("Advancing Question");
    generateQuestion();
}
function getAnswerKeyfromEvent(item) {
    let index = -1;
    $('.rdoAnswer').each(function(key, value ) {
       if (value.checked) {index = key; };        
    })
    dWrite( (index > -1)? `${index} answer was selected` :'No Answer was selected');
    return index;
}
function generateQuestion() {
    /* Calls the Question Builder HTML and Increment the Question Index */
    let q = generateQuestionTemplate(getCurrentQuestion());
    $('.js-questionAnswerWrapper').html(q);
    $('.js-questionIndex').html(getCurrentQuestionIndex() + 1);
}
function generateQuestionTemplate(item) {
    /* Returns the Question HTML*/
    let qNum = QUIZ.currentQuestionIndex + 1; //The Question Number is 1 based
    let q = `<section>
        <div class="col-12">
        <div class="questionTable">
        <h4>${qNum}. ${item.questionText}</h4>
        <ul>
        ${item.answers.map(answer => `<li class="js-item-index-element"><input type=radio name="answer" id="answer" class="radio rdoAnswer" value='${answer}'>${answer}</li>`).join('')}
        </ul>
            <button class="next js-grade" role="button" aria-pressed="false">
                <span class="button-label">Submit</span>
            </button>
        </div>
        </div>
    </section>`;
    return q;
}
function updateScore(isCorrect) {
    $('.score').removeClass("hidden");
    QUIZ.scoreCorrect += (isCorrect) ? 1 : 0;          //give credit to user if correct.
    QUIZ.scoreIncorrect += (!isCorrect) ? 1 : 0;          //increment incorrec.
    $('.js-score-correct').html(QUIZ.scoreCorrect);
    $('.js-score-incorrect').html(QUIZ.scoreIncorrect);
}
function generateGradeQuestionTemplate(questionItem, answerIndex) {   
   let isCorrect = questionItem.correctAnswerIndex === answerIndex;
   
   questionItem.userAnswerIndex = answerIndex;  //mark the user answer in the array for tallying later.
   updateScore(isCorrect);
   dWrite(QUIZ);

   let answerHtml = `<section role="content">
        <div class="col-12">
            <img src="/images/${(isCorrect) ? "Moonwalk" : "HeadShake" }.gif" height=300 width=300 alt="${(isCorrect) ? "Michael does the moon walk" : "Michael shakes his head 'No'" }" />
            <div class="answerTable">
                <h4 class="${(isCorrect) ? "correctGreen" : "incorrectRed"}" >You are ${(isCorrect) ? "Correct" : "Incorrect"}!</h4>
                <h3>The correct answer is ${questionItem.answers[questionItem.correctAnswerIndex]}.</h3>
                <button class="next js-next" role="button" aria-pressed="false">
                    <span class="button-label">Next</span>
                </button>
            </div>
        </div>
    </section>`;
    return answerHtml;
}
function generateSummaryView() {   
    dWrite('Building Summary View');
    
    let didWell = QUIZ.scoreCorrect > QUIZ.scoreIncorrect;
    let summaryHtml = `<section role="content">
         <div class="col-12">
            
             <img src="/images/${(didWell) ? "Moonwalk" : "HeadShake" }.gif" height=300 width=300 alt="${(didWell) ? "Michael does the moon walk" : "Michael shakes his head 'No'" }" />
             <div class="scoreSummary scoreTable">
                <h4>Correct: ${QUIZ.scoreCorrect}</h4>
             </div>
             <div class="scoreSummary scoreTable">
                <h4>Incorrect: ${QUIZ.scoreIncorrect}</h4>
             </div>
             <div class="answerTable">
                 <h4>You know ${(didWell) ? "a ton about Michael Jackson.  Good job!" : "a little about Michael Jackson. Would you like to try again?"}</h4>
                 <button class="next js-resetQuiz">
                     <span class="button-label" role="button" aria-pressed="false">Take the Quiz Again</span>
                 </button>
             </div>
         </div>
     </section>`;
     return summaryHtml;
 }

 function handleSummaryView() {
    let sView = generateSummaryView();
    $('.js-questionAnswerWrapper').html(sView);
    toggleCoverImage();
    toggleFooter();

    dWrite(`Score Correct: ${QUIZ.scoreCorrect}`);
    dWrite(`Score Incorrect: ${QUIZ.scoreIncorrect}`);
    dWrite(`Question Count: ${QUIZ.questions.length}`);
}
function resetQuiz() {
    dWrite('Resetting Quiz');
    
    QUIZ.scoreCorrect = 0;
    QUIZ.scoreIncorrect = 0;
    QUIZ.currentQuestionIndex = 0;
    QUIZ.questions.forEach((item) => {
        item.userAnswerIndex = 0;
    });
}
function toggleBackground(resetToInit) {
    //Hides the Intro and adds a mask to the Cover Image
    (resetToInit) ? $('#introWrapper').show() : $('#introWrapper').hide();
    $('.coverWrapper').addClass('mask');
    dWrite('Adding Mask');    
}
function toggleCoverImage() {
    $('.imgCover').toggleClass('hidden');
    dWrite('Cover Image Hidden is:' + $('.imgCover').hasClass('hidden')); 
}
function toggleFooter() {
    $('.footerWrapper').toggleClass('hidden');
}
function getCurrentQuestionIndex() {
    return QUIZ.currentQuestionIndex;
}
function getCurrentQuestion() {
    let questionItem = QUIZ.questions[getCurrentQuestionIndex()];
    return questionItem;
}
function loadQuiz() {
    
    $('.js-questionCount').html(QUIZ.questions.length)  
    generateQuestion();

    //show the footer
    toggleFooter();

    dWrite(`Score Correct: ${QUIZ.scoreCorrect}`);
    dWrite(`Score Incorrect: ${QUIZ.scoreIncorrect}`);
    dWrite(`Question Count: ${QUIZ.questions.length}`);
    dWrite(`Answer Count: ${QUIZ.questions[0].answers.length}`);    
}

function validateEntry(answerIndex) {
    if (answerIndex === -1) {
        $('.validator').removeClass("hidden");
        return false;
    }
    else {
        $('.validator').addClass("hidden");
        return true;
    }
}
function dWrite(item) {
    (isDebug) ? console.log(`${item}`) : '';    
}