# lnAddresses
Self hosted lightning address server written in express.js and svelte⚡️

<h1>LNBC.CZ HELP</h1>
<p>This server allows you to create a Lightning Address and pair it to a LNURLp from your LNbits or any other
        LNURL server (your node or any public LNbits instance).</p>
<p>There are many ways to generate your LNURL so if you’re skilled enough to do it yourself, do it. Below there
        is a simple and custodial way to do it for everybody.</p><br>
<p>1. Find a LNbits instance, e.g. <a href="https://legend.lnbits.com">legend.lnbits.com</a> or <a href="https://wallet.paralelnipolis.cz">wallet.paralelnipolis.cz</a> and create a wallet there.<br>
        2. Enable LNURLp extension and create a LNURLp that suits you.<br>
        3. On lnbc.cz choose your alias, password to this Lightning Address and provide your LNURLp. Password will
        allow you to edit or delete your Lightning Address in future. It is not passphrase or any key to your
        bitcoins but only works as an authentication method to your Lightning Address on lnbc.cz.</p><br>
<h3>DISCLAIMER:</h3>
<p>Lnbc.cz doesn’t store any private information such as private keys or your funds. Your funds are out of
        lnbc.cz in your LNbits wallet or any other wallet software provider. Lnbc.cz service is meant to be only a
        „payment router“ that points your Lightning Address to your LNURLp. Nothing else.</p><br>

<p>Please consider that this software is experimental and may contain bugs. We do not guarantee it will remain
        maintained forever. We store the alias-lnurl pair in a database so technically there is some trust involved
        because it is a centralized service - please use wisely or run your own Lightning Address server on your
        domain (<a href="https://github.com/MarioDoDo/lnAddresses">github.com/MarioDoDo/lnAddresses</a> or <a href="https://github.com/nbd-wtf/satdress">github.com/nbd-wtf/satdress)</a>. The trust is
        involved only when upcoming payment is being made. If the lightning payment is settled in your wallet, these
        funds are safe and cannot be compromised by Lnbc.cz. Another potential risk is Lnbc.cz disappearing which
        only causes these Lightning Addresses to not work anymore.</p>
