class HomeController < ApplicationController
  def index
  end

  def start
    FileUtils.touch "pusher.lock"
    render :nothing => true
  end

  def stop
    FileUtils.rm "pusher.lock"
    render :nothing => true
  end

  def load
    $bad_idea ||= []
    10000.times do
      $bad_idea << "Eating up memory... chomp.... chomp.... chomp"*50
    end
    render :nothing => true
  end

  def clear
    $bad_idea.clear if $bad_idea
    $bad_idea = nil
    GC.start
    render :nothing => true
  end
end
