const express = require('express');
const router = express.Router();
const vote  = require('../model/vote.js')

router.get('/subreaddit', (req,res) => {
    var subreaddit_id = req.query.subreaddit_id;
    var user_id = req.query.user_id;
    vote.getUserSubreadditPostVotes(user_id, subreaddit_id, (result,err) => {
        if(err) {
        res.status(500).send(err);
        } else {
        res.status(200).send(result);
        }
    })
})

router.post('/post_rating', (req,res) => {
    var user_id = req.body.user_id;
    var post_id = req.body.post_id;
    var vote_type = req.body.vote_type;

    // Find the user's standing on Post
    vote.getUserPostVotes(user_id, post_id, (result, err) => {
        if(err) {
            console.log(err)
            res.send(err);
        }
        else {
            console.log(result)
            if(result.length == 0) {
                vote.createPostVote(vote_type, post_id, user_id, (result,err) => {
                    if(err) {
                        res.status(500).send(err);
                    }
                    else {
                        res.status(201).send(result);
                    }
                })
            }
            else {
                var requested_vote;
                if(vote_type == 0) {
                    requested_vote = false;
                } else {
                    requested_vote = true;
                }


                if(requested_vote == result[0].vote_type) {
                    res.status(409).send('already same');
                }
                else if (requested_vote != result[0].vote_type) {
                    vote.updatePostVote(vote_type, post_id, user_id, (result,err) => {
                        if(err) {
                            res.status(500).send(err);
                        }
                        else {
                            console.log(result);
                            res.status(200).send("Successful change");
                        }
                    })
                }
                
            }
            
        }
    })

})

router.delete('/post_rating', (req,res) => {
    var user_id = req.body.data.user_id;
    var post_id = req.body.data.post_id;
    vote.deletePostVote(post_id, user_id, (result,err) => {
        console.log('result: ', result)
        console.log('err:', err);
        if(err) {
            res.sendStatus(500);
        }
        else {
            res.sendStatus(200);
        }
    })
})


module.exports = router;