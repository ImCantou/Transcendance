FROM		node:16

WORKDIR		/script

COPY		initBack.sh	/script

RUN			chmod 777 initBack.sh

WORKDIR		/api	

ENTRYPOINT	["/bin/bash", "../script/initBack.sh"]
