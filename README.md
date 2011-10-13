Rails Pusher, OpenShift and JavaScript
=========================

This quickstart provides a simple rails application that
feeds actual cgroup memory usage data from your application
over a websocket (using pusher.com) to a JavaScript widget
on the client side that updates real-time.

Credits
--------------------
PusherApp - http://pusherapp.com
SVG Plugin - http://keith-wood.name
JQuery - http://jquery.com
Rails - http://rubyonrails.org

Running on OpenShift
--------------------

Create an account at http://openshift.redhat.com/

Create a rails application

    rhc-create-app -a railsapp -t rack-1.1

Add mysql support to your application
    
    rhc-ctl-app -a railsapp -e add-mysql-5.1

Add this upstream rails quickstart repo

    cd railsapp
    git remote add upstream -m master git://github.com/matthicksj/pusher-on-openshift.git
    git pull -s recursive -X theirs upstream master

Then push the repo upstream

    git push

That's it, you can now checkout your application at:

    http://railsapp-$yourlogin.rhcloud.com
