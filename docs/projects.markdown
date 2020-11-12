---
layout: page
title: Projects
permalink: /projects/
---

This is an archive of my projects, broken into larger (king size) and smaller (bite size) projects.

## King Size

#### _[Regression Analysis Paper](/docs/yelp-writeup.pdf)_
This is my final report for _STAT 333: Applied Regression Analysis_.  This report was deemed exceptional enough to be awarded a score of 100% and was used to show other students in the course what an ideal report looks like.  The analyses were done in R, and all of the code for the report can be found in its GitHub repo [here]().

#### _[MapReduce](https://github.com/NathanKolbow/MapReduce)_
A C implementation of the map-(combine-)reduce framework discussed in the seminal paper MapReduce: Simplified Data Processing on Large Clusters (J Dean, S Ghemawat 2004).

#### _[eBack](https://github.com/NathanKolbow/eBack)_
A Linux backup utility written in C and the Bash scripting language.  This utility is intended to speed up large-scale, local file backups by leveraging multiple external drives.

#### _[Chess Match Analyzer](https://github.com/NathanKolbow/Chess-Match-Analyzer)_
Stockfish is an open source, world class chess AI that is widely used both in human vs. AI gameplay as well as AI vs. AI gameplay.  This program uses Stockfish to help users improve their chess skills.  By providing move-by-move feedback on full chess games, users can see how the pendulum of control swang throughout the match.


## Bite Size

#### _[MNIST Principal Component Analysis](https://github.com/NathanKolbow/MNIST_PCA)_
This project uses NumPy and SciPy to implement Principal Component Analysis.  The code easily generalizes to any dataset, but the repo focuses on displaying projections of the famous [MNIST handwritten digit dataset](http://yann.lecun.com/exdb/mnist/).

#### _[Single Linkage Hierarchical Clustering](https://github.com/nathankolbow/singlelinkage)_
Utilizing NumPy for its underlying framework, this project performs single linkage hierarchical clustering.  Like the MNIST project, this code is easily generalized to arbitrary datasets, but the repo focuses on clustering Pokémon.  The output for this code mimics the output of [scipy.cluster.hierarchy.linkage](https://docs.scipy.org/doc/scipy/reference/generated/scipy.cluster.hierarchy.linkage.html).

#### _[Cofactor Expansion Calculator](https://github.com/NathanKolbow/Determinant-Calculator)_
Cofactor expansion is a method used to compute the deterimant of some nxn matrix B.  This repo implements a naive approach to performing cofactor expansion on any nxn input matrix in both Python and Java.

#### _[Quadtree Visualizer](https://github.com/NathanKolbow/Quadtree-Visualizer)_
A quadtree is a tree data structure for which each component is broken into four subcomponents.  In the context of this project, each subcomponent is continually split apart until it is inhabited by only one of the many moving particles on the screen, or until it reaches a minimum size.  If the minimum size is reached, this is called a between any particles inhabiting that subcomponent, and an effect is drawn to the screen.

#### _[Modular Exponentiation](https://github.com/NathanKolbow/Modular-Exponentiator)_
This repo implements a simple method for performing modular exponentiation in both Java and Python.



