import os
# import docker

from shared.db import Session
from models.system import System


ENVIRONMENT = os.getenv('ENVIRONMENT', 'docker')
USE_LOCAL_HARDWARE = os.getenv('USE_LOCAL_HARDWARE', 'false').lower() == 'true'

def discover_systems():
    """
    Meant to be ran from the master roled node (system) in a cluster of nodes (systems).
    """
    session = Session()
    
    if USE_LOCAL_HARDWARE:
        local_system = session.query(System).filter_by(container_id='local').first()
        if not local_system:
            local_system = System(
                name='Local System', 
                description='System created by service. Please update accordingly', 
                url='local', 
                container_id='local',
                target_humidity=-1,
                target_temperature=-1,
                duration=-1,
                distance=-1
            )
            session.add(local_system)
    
    # TODO: Second? Maybe first
    # if ENVIRONMENT == 'kubernetes':
    #     from kubernetes import client, config
    #     config.load_incluster_config()
    #     v1 = client.CoreV1Api()
    #     pods = v1.list_pod_for_all_namespaces(label_selector="app=pi-camera").items
        
    #     for pod in pods:
    #         pi_id = pod.spec.node_name
    #         pod_ip = pod.status.pod_ip
    #         url = f"http://{pod_ip}:5000"
            
    #         camera = session.query(Camera).filter_by(name=f"Pi Camera {pi_id}").first()
    #         if not camera:
    #             camera = Camera(name=f"Pi Camera {pi_id}", url=url, container_id=pod.metadata.uid)
    #             session.add(camera)
    #         else:
    #             camera.url = url
    #             camera.container_id = pod.metadata.uid
    
    # elif ENVIRONMENT == 'docker':
        # TODO: First
        # client = docker.from_env()
        
        # for container in client.containers.list():
        #     if container.name.startswith('pi-camera-'):
        #         pi_id = container.name.split('-')[-1]
        #         ip = container.attrs['NetworkSettings']['Networks']['multi-camera_default']['IPAddress']
        #         url = f"http://{ip}:5000"
                
        #         camera = session.query(Camera).filter_by(container_id=container.id).first()
        #         if not camera:
        #             camera = Camera(name=f"Pi Camera {pi_id}", url=url, container_id=container.id)
        #             session.add(camera)
        #         else:
        #             camera.url = url
    
    session.commit()
    session.close()
