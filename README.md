epistemic-nature
================

Framework for testing "state of nature" assumptions in social epistemology

## TODO
1. Might the currentResource array in the agent be replaced with simple param - the array works fine right now
2. we should set it such that pSearch is dependent on pBelieve: if I'm not going to believe anyone, what's the point of asking?
3. Add logging per agents
4. How to visualize?
5. Each turn, iterate ove all the players, run their turns, then iterate all the resources,
and create new ones instead of those depleted - before or after the turn? can you assign depleted resources? - won't happen,
since a resource is only assigned to the precious few who asked for it before others knew of it. after that, it can no longer be assigned.
6. Before running the experiment, check and warn if (pBelieve * credibilityBias) is >= 1
7. Connect to Heroku


