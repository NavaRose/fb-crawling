#!/usr/bin/env bash
export AWS_ACCESS_KEY_ID=AKIA3GBHSUYEWL3GYFDG
export AWS_SECRET_ACCESS_KEY=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

cd ./release
zip -r deployment-${VERSION}.zip .
aws s3 cp deployment-${VERSION}.zip s3://elasticbeanstalk-ap-southeast-1-768882157065/fb-research/deployment-${VERSION}.zip --region ap-southeast-1
aws elasticbeanstalk create-application-version --application-name fb-research \
                --version-label deployment-${VERSION} --source-bundle S3Bucket="elasticbeanstalk-ap-southeast-1-768882157065",S3Key="fb-research/deployment-${VERSION}.zip" --region ap-southeast-1
aws elasticbeanstalk update-environment --application-name fb-research \
                --environment-name fb-research-env --version-label deployment-${VERSION} --region ap-southeast-1
