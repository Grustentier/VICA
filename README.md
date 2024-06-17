# VICA
App Collection 4 Genomic Variant Interpretation
## Introduction
Nowadays, there are a large number of in-silico tools that deal with the analysis and assessment of genomic variants and regions.
Modern web technologies make it possible to make the information resulting from these tools available in online databases in a structured manner and with search functions.
The current app, called VICA, combines access to such online databases within a user interface (UI).
Based on a simple set of parameters [chromosome, gene, start position, end position, ref, alt], VICA independently determines whether the set of parameters is sufficient to retrieve information from a corresponding online database.

![Image of Yaktocat](README/vica.png)

##
To all programmers who always do everything better: I am aware that nobody uses jQuery anymore and that there are better frameworks for interactive front-end design. And yes, the dirty vanilla JavaScript could certainly have been solved better. But it is enough to implement this simple idea.
## Logos
Due to copyright, the logos of external providers have been removed. However, you could obtain consent or create your own logos and simply comment out and in a few lines of code to display the logos in the UI.
## Licence
Basically, the APP is free to use. However, it is important to note that the automatic filling of the input parameters Chr, Gene, Pos | Start-Pos, End-Pos, Ref and Alt based on HGVS genomic variant description from https://mobidetails.iurc.montp.inserm.fr/MDAPI/ API is reserved for academic users only... [Only academic users!]



