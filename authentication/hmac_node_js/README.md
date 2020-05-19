#### Generate Hmac Token.


Run the following command to generate the token:
- `npm install`
- > `node index.js --tenant=<tenant> --secret=<secret> --domain=https://<tenant>.mfpro.fintechprimitives.com`

#### Sample Run Command:
> `node index.js --tenant=cybrilla --secret=dN3CmGkwRxcK7TWnK8tttDWTLH5PGprYN8XCvRQLZVmUN3nkqQ5GPAmZffejxCwp84QaHKKQcdBSNZstUS --domain=https://api.fintechprimitives.com`

#### Sample Output:
> `{ token:
   'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsInNjb3BlcyI6WyJ0ZW5hbnQiXSwidGVuYW50IjoiY3licmlsbGEiLCJpc3MiOiJjeWJyaWxsYS1hdXRoIiwiaWF0IjoxNTg5ODg2MTc1LCJleHAiOjE1ODk4ODc5NzV9.H1AbpA1dr_x9p3iwqpL9s3AcxcB18T9-dfhlxlPhHqk' }`

##### Command Line Arguments:
- `tenant` - Tenant Name Provided
- `secret` - Secret provided.
- `domain` is not mandatory. Default value: `https://api.fintechprimitives.com`