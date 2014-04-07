epistemic-nature
================

Framework for testing "state of nature" assumptions in social epistemology
 
## TODO
0. move all the constants to the experiment config, including resource initial capacity and so forth
1. Add the creation of new agents when <Condition> happens - when average energy is high?
2. we should set it such that pSearch is dependent on pBelieve: if I'm not going to believe anyone, what's the point of asking?
3. Add logging per agents
4. How to visualize?
5. Each turn, iterate ove all the players, run their turns, then iterate all the resources,
and create new ones instead of those depleted - before or after the turn? can you assign depleted resources? - won't happen,
since a resource is only assigned to the precious few who asked for it before others knew of it. after that, it can no longer be assigned.
6. Before running the experiment, check and warn if (pBelieve * credibilityBias) is >= 1
7. Connect to Heroku
8. add graph representation to the size of community and the avg energy over turns


