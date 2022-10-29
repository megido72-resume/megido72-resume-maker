# What is This ?
This software is unofficial tool for smartphone game called Megido 72, which is developed by DeNA.
You can generate an image with your game progress and play style and share it on Twitter.

# Prerequirements

[Just: command runner](https://github.com/casey/just)

[Deno: Javascript runtime](https://deno.land/)

[Python](https://www.python.org/)

[Requests: Python HTTP library](https://pypi.org/project/requests/)

[Pillow: Python imaging library](https://pypi.org/project/Pillow/)

# How to Use

1. Clone this repository to your computer.

```
$ git clone --recurse-submodules git@github.com:megido72-resume/megido72-resume-maker.git
```

2. Run following command to download megido image from offcial site and create thumbnail.

```bash
$ just prepare
```

3. Run following command to check new megido. if there is new megido, edit `data/megido_eng.csv` and run the command again.

```bash
$ just check
```


4. Finally you can deploy all the data to `./deploy`.
```bash
$ just deploy
```

# Misc

list of megido english name is taken from [here](https://docs.google.com/spreadsheets/d/1obGyQKdrTsxaOAe6sCNOIfvT8TA_apZ6c_o78pvUOB8/edit#gid=0).
