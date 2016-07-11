#!/bin/sh

# Prepares a gh-pages branch and pushes it.

set -e

fatal() {
  local code=$1
  shift
  echo "$@" >& 2
  exit $code
}

[ "$(git rev-parse HEAD)" == "$(git rev-parse master)" ] ||
    fatal 1 "Must check out \`master' branch."

git diff --exit-code HEAD > /dev/null ||
    fatal 1 "Uncommitted changes exist.  Please commit first."

cd "$(git rev-parse --show-toplevel)"
dir=$(mktemp -d)
cp -r bower_components/* "$dir"
mkdir "$dir/swipe-pages"
cp swipe-pages.{html,js} demo.html "$dir/swipe-pages"
git checkout gh-pages
trap "git checkout master" EXIT
rm -rf components/
mv "$dir" components
git add components
git commit -am 'Update demo.'
git push origin gh-pages
