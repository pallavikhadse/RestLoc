/* GET homepage */
const about = (req, res) => {
    res.render('generic-text', {
        title: 'About RestLoc',
        content: 'RestLoc was created to help people find a good restaurant offering different types of cuisines and refresherments.<br/><br/>Lorem ipsum dolor,sit amet consectetur adipisicing elit.Iusto placeat vero illum, maxime praesentium aspernatur repudiandae omnis sunt veniam cupiditate rem earum eos consequuntur deserunt ducimus quaerat hic perferendis!Doloribus!'
    });
};

module.exports = { about };