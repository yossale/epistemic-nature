epistemic-nature
================

Framework for testing "state of nature" assumptions in social epistemology

## Algorithmic
1. We should set it such that pSearch is dependent on pBelieve: if I'm not going to believe anyone, what's the point of asking? maybe P(search) = 1 - P(believe)
4. Add graph representation to the size of community and the avg energy over turns
5. Currently the main impact on the turns count is the P(findResource), and P(search). But if the parameters are equal,
 the non-utopian is winning (I think). Maybe it's the distribution of resources we need to check?
6. Add community size to logging
7. Add option to run an experiment manually + visualization
8. Add numerical avg and variance to the graphs, remove the avg from the graph itself


##Technical
1. Connect to Heroku - Done, need to push specifically to heroku I think (git push heroku master)

