    (global $thread mut i32)

    (func   $start.heart
        call($self.defineGetter<name.func> 'stopbeating'    ref($stop.beating))
        call($self.defineGetter<name.func> 'startbeating'   ref($start.beating))

        call($self.defineGetter<name.func> 'stoprendering'  ref($stop.rendering))
        call($self.defineGetter<name.func> 'startrendering' ref($start.rendering))

        call($self.defineGetter<name.func> 'startliving'    ref($start.living))
        call($self.defineGetter<name.func> 'stopliving'     ref($stop.living))

        start($beating)
    )

    (func   $start.beating   
        [*memory (memory*) isBeating true]

        warn("BEATING_STARTED")
        start($rendering)
        start($living)

        call($wasm.requestAnimationFrame f32(0))
    )

    (func   $stop.beating
        (if [*memory (memory*) isBeating]
            (then
                [*memory (memory*) isBeating false]

                stop($living)
                stop($rendering)

                warn("BEATING_STOPPED")
            )
            (else fail("ALREADY_LOST"))
        )
    )

    (func   $start.living   
        (if [*memory (memory*) isBeating]
            (then [*memory (memory*) isLiving true] warn("ALIVE"))
            (else fail("WITHOUT_HEART?")) 
        )

    )

    (func   $stop.living
        (if [*memory (memory*) isLiving]
            (then [*memory (memory*) isLiving false] warn("CORPSE"))
        )
    )

    (func   $start.rendering   
        (if [*memory (memory*) isBeating]
            (then [*memory (memory*) isRendering true] warn("VISIBLE"))
            (else fail("WITHOUT_HEART?")) 
        )
    )

    (func   $stop.rendering
        (if [*memory (memory*) isRendering]
            (then [*memory (memory*) isRendering false] warn("FORGOTTEN"))
        )
    )

    (func   $wasm.requestAnimationFrame                                                                        (type $f32->)
        [*memory (memory*) performanceNow $0]

        (if [*memory (memory*) isBeating]
            (then
                [*memory (memory*) tickCount] +1
                
                (if [*memory (memory*) isLiving] (then loop($eventPool)))    
                (if [*memory (memory*) isRendering] (then loop($framePool)))    

                (if [*memory (memory*) nextTickType] == GPU_TICK
                    (then [*memory (memory*) tickCountFrame] ++;
                        (call $self.requestAnimationFrame)
                    )
                )

                (if [*memory (memory*) nextTickType] == CPU_TICK
                    (then [*memory (memory*) tickCountIdle] ++;
                        (call $self.requestIdleCallback)
                    )
                )
            )
        )
    )

    (func $self.requestIdleCallback ref($wasm.requestAnimationFrame) call $self.requestIdleCallback<fun>)
    (func $self.requestAnimationFrame ref($wasm.requestAnimationFrame) call $self.requestAnimationFrame<fun>)

    (func   $loop.framePool
        local($work* i32)
        local($oninit* i32)
        local($ondone* i32)
        local($function* i32)
        local($handler i32)
        local($parent* i32)
        local($children* i32)
        local($subwaits i32)
        local($subjob* i32)
        local($stack* i32)
        local($t0 i32)
        local($timing* i32)
        local($remain i32)
        local($tickPeriod i32)

        local($cycleCount i32)
        local($readyState i32)
        local($timingType i32)

        (foreach $Work as $0

            this(tee $readyState [*work $0 state])
            
            (if (i32.eq WORK_STATE_DONE) 
                (then continue)
            )
             
            this(set $cycleCount [*work $0 cycleCount] ++)

            (block $check   
                (if this(tee $timing* [*work $0 timing])
                    then(

                        (if [*timing this($timing*) type] == PERIODICALLY
                            (then
                                (if [*timing this($timing*) ticksRemain] --
                                    (then continue)
                                    (else
                                        
                                        
                                        br $check 
                                        <-- şimdi periyodik tetiklenebilir every N frame -->
                                    )
                                )
                            )
                        )
                    
                        
                        (if [*timing this($timing*) type] == SCHEDULED_TICK
                            (then
                                (if [*timing this($timing*) ticksRemain] --
                                    (then continue)
                                    (else
                                        (if this($cycleCount)
                                            then( 
                                                warn("JOB state changed to ready")
                                                warn("JOB type changed to immediately")
                                                [*work this($work*) state WORK_STATE_READY]
                                                [*work this($work*) dispatchTick CURRENT_TICK]
                                                [*timing this($timing*) type IMMEDIATELY]
                                                br $check
                                            )
                                            else(                                             
                                                warn("JOB work state changed to lock")
                                                [*work this($work*) state WORK_STATE_LOCK]
                                                this(set $remain [*timing this($timing*) tick])
                                                [*timing this($timing*) ticksRemain this($remain)]
                                                continue
                                            )
                                        )                                    
                                    )
                                )
                            )
                        )
                    )
                )

                (if [*work $0 isRestricted] (then
                    (if [*work $0 threadType] != (threadType) 
                        (then continue)))
                )

                (if [*work $0 isScheduled] 
                    (then
                        (if (ltee $t0 [*work $0 dispatchTick]) 
                            (then now(i32) local($t0) i32.ge_u br_if $check)
                        )

                        (continue)
                    )
                )                
            )

            (if (i32.eq this($readyState) WORK_STATE_READY)
                then( 

                    (if cmpx($Work state $0 WORK_STATE_READY WORK_STATE_WAITS) 
                        then([*work $0 runningTime now(i32)]
                            warn("WORK WORK_STARTED") 

                            (if (ltee $oninit* [*work this($work*) oninit])
                                (then
                                    this(set $function*  [*handling this($oninit*) function])
                                    this(set $handler    [*function this($function*) handler])

                                    handle_indirect( this($work*) this($handler) )
                                )
                            )

                        )
                        (else
                            warn("WORK WORK_RECYCLE") 
                        )
                    )
                )
            )

            (if (i32.eq this($readyState) WORK_STATE_COMPLETED) 
                then( 
                    (if cmpx($Work state $0 WORK_STATE_COMPLETED WORK_STATE_DONE)
                        then([*work $0 completeTime now(i32)]
                            warn("WORK WORK_COMPLETED") 

                            (if this(tee $ondone* [*work this($work*) ondone])
                                then(
                                    this(set $function*  [*handling this($ondone*) function])
                                    this(set $handler    [*function this($function*) handler])

                                    handle_indirect( this($work*) this($handler) )
                                )
                            )

                            (if this(tee $parent* [*work $0 parent])
                                then(

                                    (foreach $children* of this($parent*)
                                        (if [*work $children* state] == WORK_STATE_WAITS
                                            (then this(set $subwaits (true)))
                                        )

                                        (if [*work $children* state] == WORK_STATE_DONE
                                            (then this(set $subjob* $children*))
                                        )
                                    )

                                    (if (i32.eqz this($subwaits))
                                        (then 
                                            (if this($subjob*)
                                                then(
                                                    this(set $stack* [*work this($subjob*) stack])
                                                    [*work this($parent*) stack this($stack*)]
                                                )
                                            )
                                            ;;info("all subjobs done")

                                            [*work this($parent*) state WORK_STATE_COMPLETED]
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )

        [*memory (memory*) tickCountFrame] 
            [*glContext (gl*) onrender] 
            
        handle_indirect()   
    )

    (func   $loop.eventPool 

    )

    (func   $next.event*                                                                                       (type $i32->)
        (local i32 i32)

        [*event $0 state EVENT_STATE_NEXT]

        (if (ltee $2 [*event $0 oncomplete])
            (then $0 handle_indirect( $2 )))

        [*event $0 timeofDone now(i32)]
        [*event $0 state EVENT_STATE_SUCCESS]

        (if (ltee $1 $0^) 
            (then [*event $1 state EVENT_STATE_WORK]))
    )


    (func   $work.event*                                                                                       (type $i32->)
        (local i32 i32)

        [*event $0 state EVENT_STATE_LOCK]
        [*event $0 timeofWork now(i32)]
        [*event $0 threadWork (thread)]

        (if (call $hasn't<*>children $0) 
            (then
                (if (ltee $2 [*event $0 onprocess])
                    (then $0 handle_indirect( $2 )))
            return)
        )

        (foreach $children* as $1 of $0
            (if [*event $1 state] == EVENT_STATE_INIT 
                (then [*event $1 state EVENT_STATE_WORK] return))
        )

        [*event $0 state EVENT_STATE_DONE]
    )

