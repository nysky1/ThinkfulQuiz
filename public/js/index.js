'use strict';
const isDebug = false;

/* EVENT HANDLERS */
$('.startQuiz').click(function () {
    toggleBackground(false);
    loadQuiz();
});
/* DELEGATES */
$('.js-questionAnswerWrapper').on('click', `.js-resetQuiz`, function (event) {
    resetQuiz();
    toggleCoverImage()
    toggleBackground(false);
    loadQuiz();
});
$('.js-questionAnswerWrapper').on('click', `.js-grade`, function (event) {
    let answerIndex = getAnswerIndexfromEvent(event.currentTarget);
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
$('form').submit( (event) => {
    dWrite('preventing default submit');    
    event.preventDefault();
})
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
        <fieldset>         
        <div class="col-12">
        <div class="questionTable">      
            <legend class="">
            <h4>${qNum}. ${item.questionText}</h4>
            </legend>
            <ul>
            ${item.answers.map(answer => `<li class="js-item-index-element"><input type=radio name="answer" id="answer" class="radio rdoAnswer" value='${answer}'>${answer}</li>`).join('')}
            </ul>
                <button class="next js-grade" role="button" aria-pressed="false">
                    <span class="button-label">Submit</span>
                </button>
            </div>
        </div>
        </div>
        </fieldset> 
    </section>`;
    return q;
}
function generateGradeQuestionTemplate(questionItem, answerIndex) {
    let isCorrect = questionItem.correctAnswerIndex === answerIndex;

    updateScore(isCorrect);
    dWrite(QUIZ);

    let answerHtml = `<section role="content">
        <div class="col-12">
            <img class="topImage" src="/images/${(isCorrect) ? "Moonwalk" : "HeadShake"}.gif" height=300 width=300 alt="${(isCorrect) ? "Michael does the moon walk" : "Michael shakes his head 'No'"}" />
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
             <img class="topImage" src="/images/${(didWell) ? "Moonwalk" : "HeadShake"}.gif" height=300 width=300 alt="${(didWell) ? "Michael does the moon walk" : "Michael shakes his head 'No'"}" />
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
function updateScore(isCorrect) {
    //show the score panel and update values
    $('.score').removeClass("hidden");
    QUIZ.scoreCorrect += (isCorrect) ? 1 : 0;          //give credit to user if correct.
    QUIZ.scoreIncorrect += (!isCorrect) ? 1 : 0;          //increment incorrec.
    $('.js-score-correct').html(QUIZ.scoreCorrect);
    $('.js-score-incorrect').html(QUIZ.scoreIncorrect);
}
/* CLASS TOGGLES */
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
/* END CLASS TOGGLES */
/* INDEX FUNCTIONS */
function getCurrentQuestionIndex() {
    return QUIZ.currentQuestionIndex;
}
function getCurrentQuestion() {
    let questionItem = QUIZ.questions[getCurrentQuestionIndex()];
    return questionItem;
}
function getAnswerIndexfromEvent(item) {
    let index = -1;
    $('.rdoAnswer').each(function (key, value) {
        if (value.checked) { index = key; };
    })
    dWrite((index > -1) ? `${index} answer was selected` : 'No Answer was selected');
    return index;
}
/* END INDEX FUNCTIONS */

function loadQuiz() {
    //generate the first question
    generateQuestion();

    //init the footer question count
    $('.js-questionCount').html(QUIZ.questions.length)

    //show the footer
    toggleFooter();

    dWrite(`Score Correct: ${QUIZ.scoreCorrect}`);
    dWrite(`Score Incorrect: ${QUIZ.scoreIncorrect}`);
    dWrite(`Question Count: ${QUIZ.questions.length}`);
    dWrite(`Answer Count: ${QUIZ.questions[0].answers.length}`);
}
function resetQuiz() {
    dWrite('Resetting Quiz');

    QUIZ.scoreCorrect = 0;
    QUIZ.scoreIncorrect = 0;
    QUIZ.currentQuestionIndex = 0;
}
/* BEGIN VALIDATION */
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
/* END VALIDATION */
function dWrite(item) {
    (isDebug) ? console.log(`${item}`) : '';
}