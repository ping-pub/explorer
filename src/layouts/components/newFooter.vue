<template>
    <footer class="footer items-center p-4 text-base">
        <div class="items-center grid-flow-col">
            &copy;
            {{ new Date().getFullYear() }}
            Made With
            <img src="../../assets/images/heart.svg"/>
            By
            <a class="link link-info no-underline" 
            href="https://ping.pub"
            target="_blank"
            rel="noopener noreferrer"
            >Ping.pub</a>
        </div> 
        <div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end hidden md:grid">
            <a  class="link link-info no-underline" 
                href="https://github.com/ping-pub/explorer/blob/master/LICENSE"
                target="noopener noreferrer"
            >License</a>
            <a class="link link-info no-underline" 
                href="https://github.com/ping-pub/explorer"
                target="noopener noreferrer"
            >Github</a>
        </div>
    </footer>
</template>