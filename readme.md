### Truffle-nice-tools
A simple (very very simple right now) yet nice toolset for  [Truffle Framework](https://truffleframework.com/) development.


##### Injecting & Extracting Networks
As Plato say, > You don't need the entire build/contracts folder to make great Truffles, only the __networks:__ part.


To extract your networks information into a simple `networks.json` file in your root repository, run:
```
npx tnt extract-networks
```

To import an already existing `networks.json` file, merging the networks stored within with your freshly compiled `build/contracts` folder.
```
npx tnt inject-networks
```

